export interface Location {
	latitude: number,
	longitude: number
}

export interface City {
    id: string,
	name: string,
	location: Location
}