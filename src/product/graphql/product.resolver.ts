import { UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { ProductService } from '../product.service';
import { CreateProductInput, UpdateProductInput } from './product.input';
import { ProductType } from './product.type';

@Resolver(() => ProductType)
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Query(() => [ProductType], { name: 'findAllProducts' })
  findAll() {
    return this.productService.findAll();
  }

  @Query(() => ProductType, { name: 'findProductById' })
  findById(@Args('id', { type: () => ID }) id: string) {
    return this.productService.findOne(id);
  }

  @Mutation(() => ProductType, { name: 'createProduct' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  create(@Args('input') input: CreateProductInput) {
    return this.productService.create(input as CreateProductDto);
  }

  @Mutation(() => ProductType, { name: 'updateProduct' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  update(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateProductInput,
  ) {
    return this.productService.update(id, input as UpdateProductDto);
  }

  @Mutation(() => Boolean, { name: 'deleteProduct' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async delete(@Args('id', { type: () => ID }) id: string) {
    await this.productService.remove(id);
    return true;
  }

  @ResolveField(() => ID)
  category(@Parent() product: any) {
    return product.category?._id?.toString() || product.category.toString();
  }

  @ResolveField(() => ID)
  brand(@Parent() product: any) {
    return product.brand?._id?.toString() || product.brand.toString();
  }

  @ResolveField(() => ID)
  createdBy(@Parent() product: any) {
    return product.createdBy?._id?.toString() || product.createdBy.toString();
  }
}
