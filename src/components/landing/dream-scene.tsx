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
              className="animate-twinkle absolute size-[2px] rounded-full bg-primary/50 dark:bg-white dark:size-[1px]"
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
            <div className="animate-nebula-pulse bg-gradient-radial absolute inset-0 rounded-[100%] from-primary/10 via-primary/5 to-transparent blur-3xl dark:from-primary/20 dark:via-primary/10" />
            <div className="animate-nebula-drift bg-gradient-radial via-purple-500/3 absolute inset-0 rounded-[100%] from-purple-500/5 to-transparent blur-3xl dark:from-purple-500/15 dark:via-purple-500/5" />
          </div>

          {/* Subtle Side Nebulas */}
          <div className="animate-nebula-drift bg-gradient-radial via-primary/3 absolute left-[20%] top-1/3 h-[300px] w-[400px] rounded-[100%] from-primary/5 to-transparent blur-3xl dark:from-primary/10" />
          <div className="animate-nebula-pulse bg-gradient-radial via-purple-500/3 absolute bottom-1/3 right-[20%] h-[250px] w-[350px] rounded-[100%] from-purple-500/5 to-transparent blur-3xl dark:from-purple-500/10" />
        </div>

        {/* Sequential ZZZ Groups */}
        {/* {[...Array(3)].map((_, i) => {
          const groupDelay = Math.random() * 4; // Random delay for the entire group
          return (
            <div
              key={i}
              className="absolute"
              style={{
                left: `${15 + Math.random() * 70}%`,
                top: `${20 + Math.random() * 60}%`,
              }}
            >
              <div className="relative">
                <span
                  className="animate-fade-in-1 absolute text-4xl font-bold text-primary/60 dark:text-muted-foreground"
                  style={{ animationDelay: `${groupDelay}s` }}
                >
                  Z
                </span>
                <span
                  className="animate-fade-in-2 absolute -translate-y-6 translate-x-6 text-3xl font-bold text-primary/50 dark:text-muted-foreground"
                  style={{ animationDelay: `${groupDelay}s` }}
                >
                  Z
                </span>
                <span
                  className="animate-fade-in-3 absolute -translate-y-10 translate-x-12 text-2xl font-bold text-primary/40 dark:text-muted-foreground"
                  style={{ animationDelay: `${groupDelay}s` }}
                >
                  Z
                </span>
              </div>
            </div>
          );
        })} */}

        {/* Subtle Gradient Overlay */}
        <div className="absolute inset-0">
          <div className="animate-float-slower bg-gradient-radial absolute inset-0 from-transparent via-transparent to-background/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-background/10 to-transparent" />
        </div>
      </div>
    </>
  );
}
