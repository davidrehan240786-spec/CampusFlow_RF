import { ArticleCardGrid } from "./ui/card-grid";

const posts = [
  {
    id: 1,
    imageSrc: 'https://images.unsplash.com/photo-1541339907198-e08756dee81c?q=80&w=2070&auto=format&fit=crop',
    title: 'How to save money on textbooks this semester',
    linkText: 'Read more',
    linkHref: '#',
  },
  {
    id: 2,
    imageSrc: 'https://images.unsplash.com/photo-1523050335102-c325090897a8?q=80&w=2070&auto=format&fit=crop',
    title: 'Top 5 tips for a secure campus meetup',
    linkText: 'Learn more',
    linkHref: '#',
  },
  {
    id: 3,
    imageSrc: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop',
    title: 'The ultimate guide to dorm room essentials',
    linkText: 'Keep reading',
    linkHref: '#',
  },
];

export default function Blog() {
  return (
    <section className="py-32 px-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="mb-20 text-center">
          <div className="inline-block px-4 py-1.5 rounded-full glass border-white/10 text-[12px] font-medium text-white/50 mb-6 uppercase tracking-wider">
            ● Campus Insights
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Campus Life & Tips</h2>
        </div>

        <ArticleCardGrid 
          title="Want to stay updated?" 
          articles={posts} 
        />
      </div>
    </section>
  );
}
