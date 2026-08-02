import os
import uuid
import mimetypes
from supabase import create_client

# -------------------------------
# Supabase Configuration
# -------------------------------
SUPABASE_URL = "https://drqieumjptfmzhizjzge.supabase.co"
SUPABASE_KEY = "sb_publishable_mCSK_djyZveTJsS4NLuKlw_0SNRIHq0"
BUCKET_NAME  = "imagies"

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)


# -------------------------------
# Upload Image to Supabase Storage
# -------------------------------
def upload_image(image_path):
    if not os.path.exists(image_path):
        raise FileNotFoundError(f"Image not found: {image_path}")

    extension    = os.path.splitext(image_path)[1]
    object_name  = str(uuid.uuid4()) + extension
    content_type = mimetypes.guess_type(image_path)[0] or "application/octet-stream"

    with open(image_path, "rb") as f:
        supabase.storage.from_(BUCKET_NAME).upload(
            path=object_name,
            file=f.read(),
            file_options={"content-type": content_type, "upsert": "false"}
        )

    image_url = supabase.storage.from_(BUCKET_NAME).get_public_url(object_name)
    return object_name, image_url


# -------------------------------
# Main — Collect Inputs & Upload
# -------------------------------
def main():
    print("=" * 50)
    print("   UniSwap — Upload Product to Database")
    print("=" * 50)
    print()

    # ----- Seller Info -----
    print("[ SELLER INFO ]")
    username = input("  Username                  : ").strip()
    audience = input("  Audience (students/faculty/all) : ").strip() or "students"

    # ----- Photos & Video -----
    print()
    print("[ PHOTOS — Upload 3 to 8 Images ]")
    images_input = []
    for i in range(1, 9):
        path = input(f"  Image {i} Path (leave blank to stop) : ").strip()
        if not path:
            break
        images_input.append(path)
        if len(images_input) >= 8:
            break

    if len(images_input) < 3:
        print(f"\n❌ At least 3 images are required. You provided {len(images_input)}.")
        return

    print()
    print("[ PRODUCT VIDEO (Optional) ]")
    video_url = input("  Video URL (YouTube/Drive/blank to skip) : ").strip() or None

    # ----- Product Core Details -----
    print()
    print("[ PRODUCT DETAILS ]")
    category       = input("  Category (Electronics/Books/Cycles/etc.) : ").strip()
    condition      = input("  Condition (Brand New/Like New/Good)       : ").strip()
    product_name   = input("  Product Name / Title                      : ").strip()
    selling_price  = int(input("  Selling Price (Rs)                    : "))
    original_price = int(input("  Original Purchase Price (Rs)          : "))
    negotiable_in  = input("  Price Negotiable? (yes/no)                : ").strip().lower()
    negotiable     = negotiable_in == "yes"

    # ----- Optional Specifications -----
    print()
    print("[ OPTIONAL SPECIFICATIONS ]")
    brand         = input("  Brand (e.g. Casio, Dell, Hero)  : ").strip() or None
    model         = input("  Model (e.g. fx-991CW)           : ").strip() or None
    purchase_year_in = input("  Purchase Year (e.g. 2024)       : ").strip()
    purchase_year = int(purchase_year_in) if purchase_year_in else None
    reason        = input("  Reason for Selling              : ").strip() or None

    # ----- Description & Location -----
    print()
    print("[ DESCRIPTION & LOCATION ]")
    description       = input("  Full Product Description        : ").strip()
    hostel            = input("  Your Hostel / Block             : ").strip() or None
    department        = input("  Your Department                 : ").strip() or None
    pickup_preference = input("  Preferred Pickup Spot           : ").strip() or None

    # ----- Upload Images -----
    print()
    print(f"Uploading {len(images_input)} image(s) to Supabase Storage...")

    object_names = []
    image_urls   = []

    try:
        for i, image_path in enumerate(images_input, 1):
            print(f"  [{i}/{len(images_input)}] Uploading: {os.path.basename(image_path)} ...", end=" ")
            obj, url = upload_image(image_path)
            object_names.append(obj)
            image_urls.append(url)
            print("✓")

        # ----- Save to Database -----
        print()
        print("Saving product to database...")

        response = supabase.table("user_images").insert({
            "username"         : username,
            "audience"         : audience,
            "object_names"     : object_names,
            "image_urls"       : image_urls,
            "video_url"        : video_url,
            "Category"         : category,
            "condition"        : condition,
            "product_name"     : product_name,
            "selling_price"    : selling_price,
            "original_price"   : original_price,
            "negotiable"       : negotiable,
            "brand"            : brand,
            "model"            : model,
            "purchase_year"    : purchase_year,
            "reason"           : reason,
            "description"      : description,
            "hostel"           : hostel,
            "department"       : department,
            "pickup_preference": pickup_preference,
            "status"           : "Pending Approval"
        }).select().execute()

        # ----- Success -----
        print()
        print("=" * 50)
        print("  ✅ Product Uploaded Successfully!")
        print("=" * 50)
        record = response.data[0]
        print(f"\n  ID              : {record.get('id')}")
        print(f"  Product         : {record.get('product_name')}")
        print(f"  Category        : {record.get('Category')}")
        print(f"  Selling Price   : Rs {record.get('selling_price')}")
        print(f"  Status          : {record.get('status')}")
        print(f"  Images Uploaded : {len(image_urls)}")
        if video_url:
            print(f"  Video URL       : {video_url}")
        print()
        print("  Image URLs:")
        for i, url in enumerate(image_urls, 1):
            print(f"    Image {i}: {url}")

    except FileNotFoundError as e:
        print(f"\n❌ File Error: {e}")
        print("   Check that all image paths are correct.")
    except Exception as e:
        print(f"\n❌ Upload Failed: {e}")


if __name__ == "__main__":
    main()
