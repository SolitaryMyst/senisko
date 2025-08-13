export default function Layout({ children }) {
  return (
    <>
      <header style={{padding:16}}>Senisko</header>
      <main>{children}</main>
      <footer style={{padding:16}}>© {new Date().getFullYear()} Senisko</footer>
    </>
  );
}
