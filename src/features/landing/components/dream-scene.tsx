export default function DreamScene() {
  return (
    <>
      {/* Animated Background */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {/* Stars */}
        <div className="absolute inset-0">
          {[...Array(1000)].map((_, i) => (
            <div
              key={i}
              className="absolute size-[2px] animate-twinkle rounded-full bg-primary/50 dark:size-[1px] dark:bg-white"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${1 + Math.random() * 2}s`,
                opacity: Math.random() * 0.7 + 0.3,
              }}
            />
          ))}
        </div>

        {/* Nebula Effect */}
        <div className="absolute inset-0">
          {/* Central Nebula */}
          <div className="absolute left-1/2 top-1/2 h-[400px] w-[800px] -translate-x-1/2 -translate-y-1/2">
            <div className="absolute inset-0 animate-nebula-pulse rounded-[100%] bg-gradient-radial from-primary/10 via-primary/5 to-transparent blur-3xl dark:from-primary/20 dark:via-primary/10" />
            <div className="via-purple-500/3 absolute inset-0 animate-nebula-drift rounded-[100%] bg-gradient-radial from-purple-500/5 to-transparent blur-3xl dark:from-purple-500/15 dark:via-purple-500/5" />
          </div>

          {/* Subtle Side Nebulas */}
          <div className="via-primary/3 absolute left-[20%] top-1/3 h-[300px] w-[400px] animate-nebula-drift rounded-[100%] bg-gradient-radial from-primary/5 to-transparent blur-3xl dark:from-primary/10" />
          <div className="via-purple-500/3 absolute bottom-1/3 right-[20%] h-[250px] w-[350px] animate-nebula-pulse rounded-[100%] bg-gradient-radial from-purple-500/5 to-transparent blur-3xl dark:from-purple-500/10" />
        </div>

        {/* Subtle Gradient Overlay */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 animate-float-slower bg-gradient-radial from-transparent via-transparent to-background/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-background/10 to-transparent" />
        </div>
      </div>
    </>
  );
}
