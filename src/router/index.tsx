import { createBrowserRouter } from "react-router-dom";

import DataRoomLayout from "@/layouts/data-room-layout";
import DataRoomPage from "@/pages/data-room-page";
import HomePage from "@/pages/home-page";

export const router = createBrowserRouter([
	{
		path: "/",
		element: <HomePage />,
	},
	{
		path: "/data-room/:dataRoomId",
		element: <DataRoomLayout />,
		children: [
			{
				index: true,
				element: <DataRoomPage />,
			},
		],
	},
]);
