import { AddAccountRepository, LoadAccountByEmailRepository, Hasher } from '@/data/protocols'
import { AddAccount } from '@/domain/usecases'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {}

  async add (data: AddAccount.Params): Promise<AddAccount.Result> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(data.email)
    let isValid = false
    if (!account) {
      const hashedPassword = await this.hasher.hash(data.password)
      isValid = await this.addAccountRepository.add({ ...data, password: hashedPassword })
    }
    return isValid
  }
}
