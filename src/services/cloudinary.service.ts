// src/services/cloudinary.service.ts

export const uploadToCloudinary = async (file: File): Promise<string> => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error("Konfigurasi Cloudinary belum dipasang di .env");
  }

  // Siapkan form data untuk dikirim
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  formData.append("folder", "helpo_profiles"); // Opsional: Folder di Cloudinary

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Gagal upload gambar ke Cloudinary");
    }

    const data = await response.json();
    // Kembalikan Secure URL (https) dari gambar yang diupload
    return data.secure_url; 
  } catch (error) {
    console.error("Cloudinary Error:", error);
    throw error;
  }
};