import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';
import { ChangelogComponent } from '../../components/changelog/changelog.component';
import { IconComponent } from '../../components/icon/icon.component';
import { featuresEnum, featuresAtGlance } from '../../enums/features.enum';
import { qa } from '../../enums/qa.enum';
import { themes } from '../../enums/theme.enum';

@Component({
	selector: 'app-page-about',
	standalone: true,
  imports: [CommonModule, NzTimelineModule, NzCollapseModule, IconComponent, ChangelogComponent],
	templateUrl: './page-about.component.html',
	styleUrls: ['./page-about.component.scss'],
})
export class PageAboutComponent {
	theme = themes[0];
	features = featuresEnum;
	featuresAtGlance = featuresAtGlance;
	qa = qa.map((item) => {
		return {
			question: item.question,
			answer: item.answer,
			disabled: false,
			active: false,
		};
	});
}
