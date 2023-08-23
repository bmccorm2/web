export const GET_CONSUMPTION = `
	query Consumption($carId: Int!) {
		cars(isOwned: true) {
			id
			displayName
		}
		summary(carId: $carId) {
			total_miles
			total_price
			total_miles_per_gallon
			total_price_per_gallon
		}
		consumption(carId: $carId) {
			id
			date
			miles_per_gallon
			price_per_gallon
			notes
		}
	}
`;

export const CREATE_CONSUMPTION = `
	mutation CreateConsumption(
		$carId: Int!
		$price: Float!
		$gallons: Float!
		$miles: Float!
		$notes: String
	) {
		createConsumption(carId: $carId, price: $price, gallons: $gallons, miles: $miles, notes: $notes)
	}
`;

export const GET_YIELDS = `
	{
		yields {
			id
			effectiveDate
			oneMonth
			threeMonth
			sixMonth
			oneYear
			twoYear
			threeYear
			fiveYear
			sevenYear
			tenYear
			twentyYear
			thirtyYear
		}
	}
`;

export const GET_CAR_DETAILS = `
	query CarDetails($carId: Int!) {
		cars(isOwned: false) {
			id
			displayName
		}
		carDetails(carId: $carId) {
			url
			price
			miles
			displayName
			year
			distance
			effectiveDate
		}
	}
`;

export const GET_BOOKS = `
query {
  books {
    title
    id
    author
    pages
    publishDate
		rating
		isFiction
		createDate
    genres {
      description
    }
  }
}
`;

export const GET_GENRES = `
query {
  genres {
    id
    description
  }
}
`;

export const CREATE_GENRE = `
mutation createGenre(
  $description: String!
) {
  createGenre(description: $description)
}
`;

export const DELETE_GENRE = `
mutation deleteGenre(
  $id: Int!
) {
  deleteGenre(id: $id)
}
`;

export const CREATE_BOOK = `
mutation createBook(
  $title: String!
  $author: String!
  $pages: Int!
  $rating: Int!
  $isFiction: Boolean!
  $genreList: [Int!]!
  $publishDate: String
  
) {
  createBook(
    title:$title
    author:$author
    pages:$pages
    rating:$rating
    isFiction:$isFiction
    genreList:$genreList
    publishDate:$publishDate
  )
}
`;

export const DELETE_BOOK = `
mutation deleteBook(
  $id: Int!
) {
  deleteBook(id: $id)
}
`;
