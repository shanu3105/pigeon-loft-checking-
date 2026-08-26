import { supabase } from './supabase'

const BUCKET_NAME = 'farm-images'

export async function uploadItemImage(file, itemId) {
  if (!file) {
    throw new Error('No file selected')
  }

  const fileExt = file.name.split('.').pop()

  const fileName = `${Date.now()}.${fileExt}`

  const filePath = `items/${itemId}/${fileName}`

  const { error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file)

  if (uploadError) {
    throw uploadError
  }

  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath)

  return {
    path: filePath,
    publicUrl: data.publicUrl,
  }
}