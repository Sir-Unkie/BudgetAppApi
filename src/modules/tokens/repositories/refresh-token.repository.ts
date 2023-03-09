import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { RefreshToken } from 'src/modules/tokens/entities/refresh-token.entity';

@Injectable()
export class RefreshTokenRepository extends Repository<RefreshToken> {
	constructor(private dataSource: DataSource) {
		super(RefreshToken, dataSource.createEntityManager());
	}
}
