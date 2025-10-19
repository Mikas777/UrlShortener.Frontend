import { Navbar } from "./components/layout/Navbar";
import { UrlTable } from "./features/url-table/UrlTable";

function App() {
  return (
    <>
      <Navbar />

      <main className="container mt-4">
        <UrlTable />
      </main>
    </>
  );
}

export default App;
