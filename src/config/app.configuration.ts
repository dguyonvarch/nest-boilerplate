export interface AppConfig {
  port: number;
}

export default (): any => ({
  port: parseInt(process.env.PORT || '3000', 10),
});
