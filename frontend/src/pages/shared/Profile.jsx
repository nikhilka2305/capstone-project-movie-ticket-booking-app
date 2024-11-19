import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import MoviePreferences from "../../components/user/MoviePreferences";

function Profile({ type, idtype }) {
	const { isAuthenticated, user } = useContext(AuthContext);
	const [userData, setUserData] = useState();
	const navigate = useNavigate();
	console.log(type);
	const [loading, setLoading] = useState(false);
	console.log(user);
	const params = useParams();

	const idValue = params[idtype];
	console.log(idValue);

	useEffect(() => {
		const serverUrl = `${
			import.meta.env.VITE_SERVER_BASE_URL
		}/${type}/${idValue}/profile`;
		setLoading(true);
		async function getUser() {
			try {
				const response = await axios.get(`${serverUrl}`);
				const responseData = response.data;
				console.log(responseData);
				setUserData(responseData);
			} catch (err) {
				console.log(err);
				if (!isAuthenticated) navigate("/");
				else if (isAuthenticated && user.role === "User")
					navigate(`/user/${user.loggedUserId}/profile`);
				else if (isAuthenticated && user.role === "TheaterOwner")
					navigate(`/theaterowner/${user.loggedUserId}/profile`);
				else if (isAuthenticated && user.role === "Admin")
					navigate(`/admin/${user.loggedUserId}/profile`);
			}
		}
		setLoading(false);
		getUser();
	}, [idValue, navigate, isAuthenticated, user]);

	return (
		<>
			{loading && <div>Loading..</div>}
			{userData ? (
				<div className="py-8 px-8 w-2/3 min-h-full mx-auto bg-white rounded-xl shadow-lg space-y-2 sm:py-4 flex flex-col gap-8 sm:items-center sm:space-y-0 sm:space-x-6 my-16">
					<img
						className="block mx-auto h-24 rounded-full sm:mx-0 sm:shrink-0"
						src={
							userData.displayImage
								? userData.displayImage
								: "https://media.istockphoto.com/id/2151669184/vector/vector-flat-illustration-in-grayscale-avatar-user-profile-person-icon-gender-neutral.jpg"
						}
						alt={`Profile photo of ${userData.username}`}
					/>

					<div className="text-center space-y-2 sm:text-left ">
						<div className="space-y-0.5 flex flex-col gap-4">
							<p className="text-xl text-black font-semibold">
								{userData.username}
							</p>
							<p className="text-slate-500 font-medium  flex gap-2">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={1.5}
									stroke="currentColor"
									className="size-6"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M16.5 12a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 1 0-2.636 6.364M16.5 12V8.25"
									/>
								</svg>
								{userData.email}
							</p>
							<p className="text-slate-500 font-medium flex gap-2">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={1.5}
									stroke="currentColor"
									className="size-6"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
									/>
								</svg>
								{userData.mobile}
							</p>
						</div>
						{userData && userData.role === "User" && (
							<MoviePreferences preferenceData={userData.moviePreferences} />
						)}
					</div>
				</div>
			) : (
				<></>
			)}
		</>
	);
}

export default Profile;
