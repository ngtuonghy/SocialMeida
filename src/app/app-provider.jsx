import { Provider } from "react-redux";
import ContextProvider from "~/context";
import { ReduxStore } from "~/stores/redux-store";
import { Suspense } from "react";
import Notification from "~/components/ui/notification/notification";
export const AppProvider = ({ children }) => {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<ContextProvider>
				<Provider store={ReduxStore}>{children}</Provider>
			</ContextProvider>
		</Suspense>
	);
};
