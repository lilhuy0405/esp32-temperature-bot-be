import {Entity, PrimaryGeneratedColumn, Column} from "typeorm"

@Entity()
export class Temperature {

  @PrimaryGeneratedColumn()
  id: number

  @Column({
    type: 'float'
  })
  humidity: number

  @Column({
    type: 'float'
  })
  temperature: number

  @Column({
    type: 'float'
  })
  heatIndex: number;

  @Column({
    type: 'int'
  })
  createdAt: number;

}
