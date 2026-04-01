import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  type QuerySnapshot,
  type Timestamp,
  type Unsubscribe,
  type DocumentData,
} from "firebase/firestore";
import { db } from "@/services/firebase/firebase";
import { supabase } from "@/lib/supabase";

export type FirestoreItem = {
  title: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  userId: string;
  createdAt: Timestamp | null;
};

export type MarketplaceItem = FirestoreItem & {
  id: string;
  name: string;
  image: string;
  location: string;
  tags: string[];
  sellerId: string;
  sellerName: string;
  status: "available";
  interest: number;
  trending: boolean;
};

type CreateItemInput = {
  title: string;
  description: string;
  price: number;
  category: string;
  userId: string;
  imageFile?: File | null;
  imageUrl?: string;
};

const ITEMS_COLLECTION = "items";
const ITEM_PLACEHOLDER_IMAGE = "https://picsum.photos/seed/campusflow-item/600/600";

export async function uploadItemImage(userId: string, file: File) {
  if (!userId?.trim()) {
    throw new Error("Authenticated user is required to upload item image.");
  }

  const timestamp = Date.now();
  const sanitizedFileName = file.name.replace(/\s+/g, "-");
  const filePath = `items/${userId}/${timestamp}-${sanitizedFileName}`;

  const { error: uploadError } = await supabase.storage
    .from("items")
    .upload(filePath, file, {
      upsert: false,
      contentType: file.type || undefined,
    });

  if (uploadError) {
    console.error("[Supabase] Failed to upload item image:", uploadError);
    throw new Error("Failed to upload image. Please try again.");
  }

  const { data } = supabase.storage.from("items").getPublicUrl(filePath);
  if (!data?.publicUrl) {
    throw new Error("Image uploaded, but public URL could not be generated.");
  }

  return data.publicUrl;
}

export async function createItem(input: CreateItemInput) {
  if (!input.userId?.trim()) {
    throw new Error("Authenticated user is required to create an item.");
  }

  const resolvedImageUrl = input.imageFile
    ? await uploadItemImage(input.userId, input.imageFile)
    : input.imageUrl || ITEM_PLACEHOLDER_IMAGE;

  return addDoc(collection(db, ITEMS_COLLECTION), {
    title: input.title,
    description: input.description,
    price: input.price,
    category: input.category,
    imageUrl: resolvedImageUrl,
    userId: input.userId,
    createdAt: serverTimestamp(),
  });
}

function mapItem(doc: QuerySnapshot<DocumentData>["docs"][number]): MarketplaceItem {
  const data = doc.data() as Partial<FirestoreItem>;

  return {
    id: doc.id,
    title: data.title || "Untitled Item",
    description: data.description || "",
    price: typeof data.price === "number" ? data.price : 0,
    category: data.category || "Other",
    imageUrl: data.imageUrl || ITEM_PLACEHOLDER_IMAGE,
    userId: data.userId || "",
    createdAt: data.createdAt || null,
    name: data.title || "Untitled Item",
    image: data.imageUrl || ITEM_PLACEHOLDER_IMAGE,
    location: "Campus",
    tags: [],
    sellerId: data.userId || "",
    sellerName: "Campus User",
    status: "available",
    interest: 0,
    trending: false,
  };
}

export function subscribeToItems(
  onItems: (items: MarketplaceItem[]) => void,
  onError?: (error: unknown) => void
): Unsubscribe {
  const itemsQuery = query(collection(db, ITEMS_COLLECTION), orderBy("createdAt", "desc"));

  return onSnapshot(
    itemsQuery,
    (snapshot) => {
      onItems(snapshot.docs.map(mapItem));
    },
    onError
  );
}
