import { defineCollection, z } from "astro:content";
import { MongoClient, ObjectId } from "mongodb";

// 1. MongoDB 连接管理
const MONGODB_URI = import.meta.env.MONGODB_URI || "mongodb://localhost:27017";
const MONGODB_DB = "yukina";

// 客户端实例缓存
let mongoClient: MongoClient | null = null;

async function getMongoClient() {
  if (mongoClient) return mongoClient;

  const client = new MongoClient(MONGODB_URI, {
    ignoreUndefined: true,
    maxPoolSize: 10,
  });

  try {
    await client.connect();
    console.log("✅ MongoDB 连接成功");
    mongoClient = client;
    return client;
  } catch (err) {
    console.error("❌ MongoDB 连接失败:", err);
    throw err;
  }
}

async function closeMongoClient() {
  if (mongoClient) {
    await mongoClient.close();
    mongoClient = null;
    console.log("🔌 MongoDB 连接已关闭");
  }
}

if (import.meta.hot) {
  import.meta.hot.on('close', closeMongoClient);
}


type ReadingMetadata = {
  time: number;
  wordCount: number;
};

interface ContentEntry {
  id: string;
  author: string;
  category: string;
  cover: string;
  description: string;
  licenseUrl:string;
  slug: string;
  body: string;
  title: string;
  published: Date;
  draft?: boolean;
  tags?: string[];
  readingMetadata?: ReadingMetadata;
}



async function mongoLoader(collectionName: string): Promise<ContentEntry[]> {
  let client: MongoClient | null = null;

  try {
    client = await getMongoClient();
    const db = client.db(MONGODB_DB);
    const collection = db.collection(collectionName);

    console.log(`📂 正在加载集合: ${collectionName}`);

    // 添加查询日志
    console.log(`🔎 查询集合 ${collectionName} 的所有文档...`);


    const documents = await collection.find({}).project({
      _id: 1,
      slug: 1,
      title: 1,
      published: 1,
      content: 1,
      draft: 1,
      description: 1,
      cover: 1,
      tags: 1,
      category: 1,
      author: 1,
      sourceLink: 1,
      licenseName: 1,
      licenseUrl: 1,
      readingMetadata: 1
    }).toArray();

    console.log(`✅ 找到 ${documents.length} 个文档 `);


    return documents.map((doc) => (
    {
      id: doc.slug.toString(),
      slug: doc.slug || doc._id.hash.toString(),
      title: doc.title || "未命名文档",
      subTitle:  doc.subTitle || " ",
      bannerImage: doc.bannerImageUrl || "https://s2.loli.net/2025/01/25/FPpTrQSezM8ivbl.webp",
      body: doc.content || "# 默认内容\n\n请编辑此文档",
      published:  new Date(doc.published),
      draft: doc.draft || false,
      tags: doc.tags || " ",
      sourceLink: doc.sourceLink || " ",
      licenseName: doc.licenseName || " ",
      licenseUrl: doc.licenseUrl ||  " ",
      author: doc.author || "",
      category: doc.category || "",
      cover: doc.cover || "",
      description: doc.description || "",
      readingMetadata: doc.readingMetadata || { time: 0 , wordCount:0},

    }));

  } catch (err) {
    console.error(`❌ 加载集合 ${collectionName} 时出错:`, err);
    return [];
  }
}

// 内容模式定义
const contentSchema = z.object({
  title: z.string().default("未命名文档"),
  slug: z.string(),
  published: z.date().default(new Date()),
  body: z.string().default("# 默认内容\n\n请编辑此文档"),
  draft: z.boolean().optional().default(false),
  description: z.string().optional().default(""),
  cover: z.string().optional(),
  tags: z.array(z.string()).optional().default([]),
  category: z.string().optional(),
  author: z.string().optional(),
  licenseUrl: z.string().optional(),
  readingMetadata: z.object({
    time: z.number().default(0),
    wordCount: z.number().default(0)
  }).optional()
});


const posts = defineCollection({
  loader: () => mongoLoader("posts"),
  schema: contentSchema
});


export const collections = { posts };
