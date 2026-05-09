const App = () => {
  return (
    <div className="dark-page flex items-center justify-center p-6">
      <div className="dark-glass-card animate-fade-in rounded-4xl p-10 text-center">
        <div className="animate-float-glow mx-auto mb-6 h-24 w-24 rounded-full bg-linear-to-r from-indigo-500 to-violet-600 dark-glow" />

        <h1 className="dark-gradient-text text-5xl font-black">
          VabticResume
        </h1>

        <p className="mt-4 max-w-xl text-gray-300">
          Premium dark theme resume builder with futuristic UI, smooth animation,
          and modern glassmorphism design.
        </p>
      </div>
    </div>
  );
};

export default App;