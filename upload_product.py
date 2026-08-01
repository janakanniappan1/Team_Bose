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
# Upload Image
# -------------------------------
def upload_image(image_path):

    if not os.path.exists(image_path):
        raise FileNotFoundError(f"{image_path} not found.")

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
# Main
# -------------------------------
def main():

    print("========== PRODUCT DETAILS ==========\n")

    username = input("Username             : ")
    category = input("Category             : ")
    condition = input("Condition            : ")
    product_name = input("Product Name         : ")
    selling_price = int(input("Selling Price        : "))
    original_price = int(input("Original Price       : "))
    brand = input("Brand                : ")
    model = input("Model                : ")
    purchase_year = int(input("Purchase Year        : "))
    negotiable = input("Negotiable (yes/no)  : ").lower() == "yes"
    reason = input("Reason for Selling   : ")
    description = input("Description          : ")

    print("\nSelect 3 Images\n")

    image1 = input("Image 1 Path : ")
    image2 = input("Image 2 Path : ")
    image3 = input("Image 3 Path : ")

    object_names = []
    image_urls = []

    try:

        for image in [image1, image2, image3]:

            obj, url = upload_image(image)

            object_names.append(obj)
            image_urls.append(url)

        response = supabase.table("user_images").insert({

            "username": username,
            "object_names": object_names,
            "image_urls": image_urls,
            "Category": category,
            "condition": condition,
            "product_name": product_name,
            "selling_price": selling_price,
            "original_price": original_price,
            "brand": brand,
            "model": model,
            "purchase_year": purchase_year,
            "negotiable": negotiable,
            "reason": reason,
            "description": description

        }).execute()

        print("\nProduct Uploaded Successfully!\n")
        print(response.data)

    except Exception as e:
        print("Error:", e)


if __name__ == "__main__":
    main()
