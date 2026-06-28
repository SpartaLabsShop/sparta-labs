import { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { accessContent } from '../access/content'

export const BlogPosts: CollectionConfig = {
  slug: 'blog-posts',
  admin: { defaultColumns: ['title', 'author', 'status', 'publishedAt'] },
  access: accessContent,
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', admin: { position: 'sidebar' } },
    { name: 'author', type: 'relationship', relationTo: 'users', required: true },
    { name: 'featuredImageUrl', type: 'text', admin: { description: 'External URL for the featured image (e.g. Unsplash, Cloudinary)' } },
    { name: 'excerpt', type: 'textarea', admin: { description: 'Short summary shown on blog cards' } },
    { name: 'content', type: 'richText', editor: lexicalEditor() },
    { name: 'publishedAt', type: 'date' },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        if (operation === 'create' && !data.slug && data.title) {
          data.slug = data.title.toLowerCase().replace(/\s+/g, '-')
        }
        return data
      },
    ],
  },
}
