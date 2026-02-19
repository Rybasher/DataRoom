import { RouterProvider } from "react-router-dom";

import { Toaster } from "@/components/ui/sooner";
import { ReactQueryProvider } from "@/providers/query-provider";
import { router } from "@/router";

function App() {
	return (
		<ReactQueryProvider>
			<RouterProvider router={router} />
			<Toaster />
		</ReactQueryProvider>
	);
}

export default App;
