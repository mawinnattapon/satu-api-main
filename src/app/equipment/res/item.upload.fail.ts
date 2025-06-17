import { ApiProperty } from "@nestjs/swagger";
import { EqmTypeEntity } from "src/entities/equipment/equipment.type.entity";
import { CategoryEntity } from "src/entities/forms/category.entity";
import { ImportEqmTempEntity } from "src/entities/import.eqm.temp.entity";

export class ImportFailMsg {
	@ApiProperty({ type: Number, default: null, })
	line: number = null;

	@ApiProperty({ type: Array, default: [], })
	messages: string[] = [];

	static init(partial: Partial<ImportEqmTempEntity> = null, msg: { [key: string]: string; }, master: Master): ImportFailMsg {
		if (partial) {
			let self = new ImportFailMsg();
			for (const key of Object.keys(self)) self[key] = partial[key];
			self.messages = [];
			partial.validate.forEach(e => {
				let example: string;
				switch (e.key) {
					// case 'category':
					// 	example = this.truncateArray(master.category?.map(i => i.name));
					// 	break;
					// case 'eqm_type':
					// 	example = this.truncateArray(master.eqm_type?.map(i => i.name));
					// 	break;
					default:
						example = '';
						break;
				}

				e.error_code.forEach(i => {
					self.messages.push(this.format(msg[i] ?? "", { name: this.header(e.key), data: partial[e.key], example }));
				});
			});
			return self;
		} else {
			return null;
		}
	}

	private static header(name: string) {
		const key = {
			"equip_name": "Equipment Name",
			"alt_no": "Alternative ID",
			"brand": "Brand",
			"model": "Model",
			"categories": "Categories",
			"eqm_type": "Type",
			"project": "Company Project",
			"location": "Location",
			"purchase_date": "Purchase Date",
			"installation_date": "Installation Date",
			"detail": "Description",
		};
		return key[name] || name;
	}

	private static format(str: string, args: { [key: string]: any; }) {
		return str.replace(/%(\w+)/g, (_, key) => args[key]);
	}

	private static truncateArray(arr: string[], maxLength: number = 4): string {
		if (arr?.length <= maxLength) return arr.join(', ');
		return arr?.slice(0, maxLength - 1).concat('...', arr[arr.length - 1]).join(', ');
	};
}

export class Master {
	category: CategoryEntity[];
	eqm_type: EqmTypeEntity[];
}