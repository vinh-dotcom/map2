// upload.js
async function uploadImage(file) {
    const fileName = `${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage.from('marker-images').upload(fileName, file);
    if (error) {
        alert(error.message);
        return null;
    }
    const { data: publicData } = supabase.storage.from('marker-images').getPublicUrl(fileName);
    return publicData.publicUrl;
}