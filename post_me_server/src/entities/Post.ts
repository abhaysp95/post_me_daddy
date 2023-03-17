import { Entity, OptionalProps, PrimaryKey, Property } from '@mikro-orm/core';
import { Field, ID, ObjectType } from 'type-graphql';

/** this class also acts as Schema for graphql, thanks to type-graphql */

@ObjectType()  // turn classes into graphql type
@Entity()
export class Post {

	[OptionalProps]?: 'createdAt' | 'updatedAt'

	@Field(() => ID)  // field to be exposed
	@PrimaryKey()
	id!: number;

	@Field()
	@Property({ type: "date" })
	createdAt?: Date =  new Date();

	@Field()
	@Property({ type: "date", onUpdate: () => new Date() })
	updatedAt: Date = new Date();

	@Field()
	@Property(/* { default: 'name' } */)
	title!: String;
}
