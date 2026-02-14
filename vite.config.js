import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'save-to-source',
      configureServer(server) {
        server.middlewares.use('/api/save', (req, res, next) => {
          if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => {
              body += chunk.toString();
            });
            req.on('end', () => {
              try {
                const data = JSON.parse(body);
                // Format the file content
                const fileContent = `export const initialData = ${JSON.stringify(data, null, 2)};`;

                // Path to initialData.js
                const filePath = path.resolve(__dirname, 'src/data/initialData.js');

                // Write to file
                fs.writeFileSync(filePath, fileContent);

                res.statusCode = 200;
                res.end(JSON.stringify({ success: true }));
                console.log('✅ Changes saved to src/data/initialData.js');
              } catch (err) {
                console.error('❌ Error saving file:', err);
                res.statusCode = 500;
                res.end(JSON.stringify({ error: err.message }));
              }
            });
          } else {
            next();
          }
        });
      }
    }
  ],
  server: {
    proxy: {
      '/auth': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      },
      '/portfolio': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      },
      '/public': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
