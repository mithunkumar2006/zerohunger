export default function Skeleton({
  variant = "text",
  className = "",
}) {
  const base = "bg-white/5 animate-pulse rounded";

  const styles = {
    text: `${base} h-4 w-3/4`,
    title: `${base} h-6 w-1/2 rounded-md`,
    avatar: `${base} h-10 w-10 rounded-full`,
    thumbnail: `${base} h-20 w-20 rounded-xl`,
    card: `${base} h-48 w-full rounded-2xl`,
    button: `${base} h-11 w-32 rounded-xl`,
    block: `${base} w-full h-full`,
  };

  return <div className={`${styles[variant]} ${className}`} />;
}
