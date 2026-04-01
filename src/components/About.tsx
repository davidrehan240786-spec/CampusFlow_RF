import TextBlockAnimation from './ui/text-block-animation';

export default function About() {
  return (
    <section className="py-32 px-6" id="about">
      <div className="max-w-[1200px] mx-auto space-y-8">
        <TextBlockAnimation blockColor="#ffffff" duration={0.6} delay={0.1}>
          <div className="inline-block px-4 py-1.5 rounded-full glass border-white/10 text-[12px] font-medium text-white/50 uppercase tracking-wider">
            ● About CampusFlow
          </div>
        </TextBlockAnimation>
        
        <div className="w-full">
          <TextBlockAnimation blockColor="#ffffff" duration={0.8} stagger={0.05}>
            <p className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight leading-tight text-white">
              CampusFlow is a next-generation marketplace and recovery platform designed exclusively for students. We combine a secure verified network with smart matching technology to help you buy essentials, sell pre-loved items, and recover lost belongings with ease.
            </p>
          </TextBlockAnimation>
        </div>
      </div>
    </section>
  );
}
