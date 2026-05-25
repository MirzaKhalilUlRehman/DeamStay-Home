import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://myfunqiyvlsjwgpscmzs.supabase.co";
const SUPABASE_PUBLIC_KEY = "sb_publishable_CnJn5YV1Zq97D7xYZ0OSBQ_DIslXon_";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);

async function main() {
  const fileData = Buffer.from("dummy-image-contents");
  const path = `test-folder/test-file-${Date.now()}.txt`;

  console.log("Testing upload to 'properties' bucket...");
  try {
    const { data, error } = await supabase.storage
      .from("properties")
      .upload(path, fileData, { contentType: "text/plain", upsert: true });
    if (error) {
      console.log("properties upload failed:", error.message, JSON.stringify(error));
    } else {
      console.log("properties upload SUCCEEDED!", data);
    }
  } catch (err) {
    console.error("properties upload exception:", err);
  }

  console.log("\nTesting upload to 'properties-img' bucket...");
  try {
    const { data, error } = await supabase.storage
      .from("properties-img")
      .upload(path, fileData, { contentType: "text/plain", upsert: true });
    if (error) {
      console.log("properties-img upload failed:", error.message, JSON.stringify(error));
    } else {
      console.log("properties-img upload SUCCEEDED!", data);
    }
  } catch (err) {
    console.error("properties-img upload exception:", err);
  }
}

main();
