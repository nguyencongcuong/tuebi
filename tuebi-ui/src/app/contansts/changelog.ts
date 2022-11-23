interface ChangeLog {
	version: string;
	release_date: string;
	changes: { new: string[]; improved: string[]; fixed: string[] }[];
}

export const changelog: ChangeLog[] = [
	{
		version: 'v1.0.0',
		release_date: '2023-01-01',
		changes: [
			{
				new: ['1st day on production and help people have a better workflow.'],
				improved: [],
				fixed: [],
			},
		],
	},
];
