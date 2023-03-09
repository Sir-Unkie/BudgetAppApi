import { User } from 'src/modules/users/entities/user.entity';
import { Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class RefreshToken {
	@PrimaryColumn()
	token: string;

	@OneToOne(() => User, user => user.refreshToken, { onDelete: 'CASCADE' })
	@JoinColumn()
	user: User;
}
