import os
import uuid
import mimetypes
from supabase import create_client

# -------------------------------
# Supabase Configuration
# -------------------------------
SUPABASE_URL = "https://drqieumjptfmzhizjzge.supabase.co"
SUPABASE_KEY = "sb_publishable_mCSK_djyZveTJsS4NLuKlw_0SNRIHq0"

BUCKET_NAME = "imagies"

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)


# -------------------------------
# Upload Image to Supabase Storage
# -------------------------------
def upload_image(image_path):
    if not os.path.exists(image_path):
        raise FileNotFoundError(f"Image not found: {image_path}")

    extension = os.path.splitext(image_path)[1]
    object_name = str(uuid.uuid4()) + extension
    content_type = mimetypes.guess_type(image_path)[0] or "application/octet-stream"

    with open(image_path, "rb") as f:
        supabase.storage.from_(BUCKET_NAME).upload(
            path=object_name,
            file=f.read(),
            file_options={
                "content-type": content_type,
                "upsert": "false"
            }
        )

    image_url = supabase.storage.from_(BUCKET_NAME).get_public_url(object_name)
    return object_name, image_url


# -------------------------------
# Main — Collect Inputs & Upload
# -------------------------------
def main():
    print("=" * 45)
    print("   UniSwap — Upload Product to Database")
    print("=" * 45)
    print()

    username      = input("Username             : ").strip()
    category      = input("Category             : ").strip()
    condition     = input("Condition            : ").strip()
    product_name  = input("Product Name         : ").strip()
    selling_price = int(input("Selling Price (₹)    : "))
    original_price= int(input("Original Price (₹)   : "))
    brand         = input("Brand                : ").strip()
    model         = input("Model                : ").strip()
    purchase_year = int(input("Purchase Year        : "))
    negotiable    = input("Negotiable (yes/no)  : ").strip().lower() == "yes"
    reason        = input("Reason for Selling   : ").strip()
    description   = input("Description          : ").strip()

    print()
    print("--- Select 3 Images ---")
    image1 = input("Image 1 Path         : ").strip()
    image2 = input("Image 2 Path         : ").strip()
    image3 = input("Image 3 Path         : ").strip()

    print()
    print("Uploading images to Supabase Storage...")

    object_names = []
    image_urls   = []

    try:
        for i, image_path in enumerate([image1, image2, image3], 1):
            print(f"  Uploading image {i}/3 : {os.path.basename(image_path)}")
            obj, url = upload_image(image_path)
            object_names.append(obj)
            image_urls.append(url)
            print(f"  ✓ Uploaded → {url[:60]}...")

        print()
        print("Saving product to database...")

        response = supabase.table("user_images").insert({
            "username"       : username,
            "object_names"   : object_names,
            "image_urls"     : image_urls,
            "Category"       : category,
            "condition"      : condition,
            "product_name"   : product_name,
            "selling_price"  : selling_price,
            "original_price" : original_price,
            "brand"          : brand,
            "model"          : model,
            "purchase_year"  : purchase_year,
            "negotiable"     : negotiable,
            "reason"         : reason,
            "description"    : description
        }).execute()

        print()
        print("=" * 45)
        print("  ✅ Product Uploaded Successfully!")
        print("=" * 45)
        print()
        print("Inserted Record:")
        for key, val in response.data[0].items():
            if key not in ("object_names", "image_urls"):
                print(f"  {key:<18}: {val}")
        print()
        print("Image URLs:")
        for i, url in enumerate(image_urls, 1):
            print(f"  Image {i}: {url}")

    except FileNotFoundError as e:
        print(f"\n❌ Error: {e}")
        print("   Please check that the image paths are correct.")
    except Exception as e:
        print(f"\n❌ Upload Failed: {e}")


if __name__ == "__main__":
    main()
