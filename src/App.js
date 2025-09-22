import { BrowserRouter, Routes, Route } from "react-router-dom";
import WithTest from "./withtest";
import Sidebar from "./sidebar";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WithTest />}>
          <Route path="/" element={<Sidebar />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
