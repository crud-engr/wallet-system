import "dotenv/config";
import app from "@/app";

const missingEnvVars = ['DATABASE_URL', 'JWT_SECRET', 'JWT_EXPIRES_IN'].filter(
  (key) => !process.env[key]
);

if (missingEnvVars.length > 0) {
  console.error(`Fatal: Missing required environment variables: ${missingEnvVars.join(', ')}`);
  process.exit(1);
}

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
