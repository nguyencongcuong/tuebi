import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';
import { IconComponent } from 'src/app/components/icon/icon.component';
import { changelog } from '../../contansts/changelog';
import { features, featuresAtGlance } from '../../contansts/features';
import { qa } from '../../contansts/qa';
import { themes } from '../../contansts/theme';

@Component({
	selector: 'app-page-about',
	standalone: true,
	imports: [CommonModule, NzTimelineModule, NzCollapseModule, IconComponent],
	templateUrl: './page-about.component.html',
	styleUrls: ['./page-about.component.scss'],
})
export class PageAboutComponent {
	changelog = changelog;
	theme = themes[0];
	features = features;
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
