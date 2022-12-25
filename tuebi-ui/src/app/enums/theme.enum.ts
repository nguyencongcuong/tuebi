export const ThemeEnum = {
	COLOR: {
		MAGENTA: 'magenta',
		RED: 'red',
		VOLCANO: 'volcano',
		ORANGE: 'orange',
		GOLD: 'gold',
		LIME: 'lime',
		GREEN: 'green',
		CYAN: 'cyan',
		BLUE: 'blue',
		GEEKBLUE: 'geekblue',
		PURPLE: 'purple'
	}
};

interface Theme {
	name: string;
	color: {
		primary: {
			light: string,
			main: string,
			dark: string
		},
		secondary: {
			light: string,
			main: string,
			dark: string
		},
		accent: {
			light: string,
			main: string,
			dark: string
		}
	};
}

export const themes: Theme[] = [
	{
		name: '1',
		color: {
			primary: {
				light: '#fafafa',
				main: '#E9EAE7',
				dark: '#505250'
			},
			secondary: {
				light: '',
				main: '#F5F5F5',
				dark: ''
			},
			accent: {
				light: '#FCD69C',
				main: '#FCD69C',
				dark: '#85c6da'
			}
		}
	}
];