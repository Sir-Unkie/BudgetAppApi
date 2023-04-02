export class TransactionResponseApiResponseDto {
	/**
	 * Unique identifier
	 */
	id: string;

	/**
	 * Transaction value in rubles
	 */
	amount: number;

	/**
	 * Comment to transaction
	 */
	comment?: string;

	/**
	 * Date of transaction
	 */
	date: string;

	/**
	 * Relation to budget
	 */
	budget?: string;

	/**
	 * Relation to category
	 */
	category?: string;
}
