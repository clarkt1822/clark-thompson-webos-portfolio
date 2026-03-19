import { Tag } from "./tag";

export function SectionHeader({
  eyebrow,
  title,
  description
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4">
      <Tag>{eyebrow}</Tag>
      <div className="max-w-3xl space-y-3">
        <h2 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
          {title}
        </h2>
        <p className="text-base leading-7 text-mist md:text-lg">{description}</p>
      </div>
    </div>
  );
}
