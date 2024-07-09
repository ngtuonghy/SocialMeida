const array = [
	{
		id: 1,
		name: "John Doe",
		email: "t",
	},
	{
		id: 2,
		name: "Jane Doe",
		email: "ng@gmail.com",
	},
];

array.map((item) => {
	<div>
		<div>{item.name}</div>
		<p>{item.id}</p>
	</div>;
	// console.log(item.email);
	//
});
