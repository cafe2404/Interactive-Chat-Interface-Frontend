import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })

export default defineConfig({
  server: {
    host: '0.0.0.0', // hoặc trực tiếp là IP máy tính bạn (ví dụ '192.168.1.5')
    port: 5173,       // có thể đổi nếu cần
  }
});


