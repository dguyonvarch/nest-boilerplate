export interface DbConfig {
  url: string;
}

export default (): DbConfig => ({
  url: process.env.DATABASE_URL || 'file:./dev.db',
});
