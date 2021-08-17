import '../src/index.css';

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}

const withTailwindWrapper=(Story,context)=> (
  <div className="tailwind">
    <div className="font-sans">
      <Story {...context} />
    </div>
  </div>
);

export const decorators = [withTailwindWrapper];