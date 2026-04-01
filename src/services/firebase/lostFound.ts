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

export type FirestoreLostFoundItem = {
  title: string;
  description: string;
  category: string;
  location: string;
  type: "lost" | "found";
  status: "searching";
  imageUrl: string;
  userId: string;
  createdAt: Timestamp | null;
};

export type LostFoundItem = Omit<FirestoreLostFoundItem, "type" | "status"> & {
  id: string;
  name: string;
  type: "Lost" | "Found";
  status: string;
  reporterId: string;
  reporterName: string;
  date: string;
  match: number | null;
  color: string;
  bg: string;
  border: string;
  glow: string;
};

type CreateLostFoundInput = {
  title: string;
  description: string;
  category: string;
  location: string;
  type: "lost" | "found";
  userId: string;
  imageFile?: File | null;
  imageUrl?: string;
};

const LOST_FOUND_COLLECTION = "lost_found";
const ITEM_PLACEHOLDER_IMAGE = "https://picsum.photos/seed/campusflow-lost-found/600/600";

async function uploadLostFoundImage(userId: string, file: File) {
  if (!userId?.trim()) {
    throw new Error("Authenticated user is required to upload report image.");
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
    console.error("[Supabase] Failed to upload lost_found image:", uploadError);
    throw new Error("Failed to upload image. Please try again.");
  }

  const { data } = supabase.storage.from("items").getPublicUrl(filePath);
  if (!data?.publicUrl) {
    throw new Error("Image uploaded, but public URL could not be generated.");
  }

  return data.publicUrl;
}

export async function createLostFoundReport(input: CreateLostFoundInput) {
  if (!input.userId?.trim()) {
    throw new Error("Authenticated user is required to create a report.");
  }

  const resolvedImageUrl = input.imageFile
    ? await uploadLostFoundImage(input.userId, input.imageFile)
    : input.imageUrl || ITEM_PLACEHOLDER_IMAGE;

  return addDoc(collection(db, LOST_FOUND_COLLECTION), {
    title: input.title,
    description: input.description,
    category: input.category,
    location: input.location,
    type: input.type,
    status: "searching",
    imageUrl: resolvedImageUrl,
    userId: input.userId,
    createdAt: serverTimestamp(),
  });
}

function mapLostFoundItem(doc: QuerySnapshot<DocumentData>["docs"][number]): LostFoundItem {
  const data = doc.data() as Partial<FirestoreLostFoundItem>;
  const itemType = data.type === "found" ? "found" : "lost";

  return {
    id: doc.id,
    title: data.title || "Untitled Item",
    description: data.description || "",
    category: data.category || "Other",
    location: data.location || "Campus",
    type: itemType === "found" ? "Found" : "Lost",
    status: data.status ? String(data.status).replace(/\b\w/g, (c) => c.toUpperCase()) : "Searching",
    imageUrl: data.imageUrl || ITEM_PLACEHOLDER_IMAGE,
    userId: data.userId || "",
    createdAt: data.createdAt || null,
    name: data.title || "Untitled Item",
    reporterId: data.userId || "",
    reporterName: "Campus User",
    date: "Just now",
    match: null,
    color: itemType === "found" ? "text-blue-400" : "text-red-400",
    bg: itemType === "found" ? "bg-blue-500/10" : "bg-red-500/10",
    border: itemType === "found" ? "border-blue-500/20" : "border-red-500/20",
    glow: "",
  };
}

export function subscribeToLostFoundReports(
  onItems: (items: LostFoundItem[]) => void,
  onError?: (error: unknown) => void
): Unsubscribe {
  const lostFoundQuery = query(collection(db, LOST_FOUND_COLLECTION), orderBy("createdAt", "desc"));

  return onSnapshot(
    lostFoundQuery,
    (snapshot) => {
      onItems(snapshot.docs.map(mapLostFoundItem));
    },
    onError
  );
}
