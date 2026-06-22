import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      '*.ts': {
        loaders: ['ts-loader'], 
        as: '*.js',
      },
      '*.tsx': {
        loaders: ['ts-loader'],
        as: '*.js',
      },
    },
  },
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      include: /node_modules\/coco-alert/,
      use: {
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
          compilerOptions: {
            module: 'esnext',
          },
        },
      },
    });
    return config;
  },
};

export default nextConfig;