import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";
import { ERoles } from "../types/roles.enum";

@Entity()
@Unique(['roleName'])
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: ERoles,
    default: ERoles.user,
  })
  roleName: ERoles;
}
