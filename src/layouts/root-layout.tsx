import { Outlet } from "react-router-dom";
import { NuqsAdapter } from "nuqs/adapters/react-router/v6";

export default function RootLayout() {
	return (
		<NuqsAdapter>
			<Outlet />
		</NuqsAdapter>
	);
}
