import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ChatbotComponent } from './chatbot.component';
import { TranslateModule } from '@ngx-translate/core';
import { SelectModule } from 'primeng/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideZonelessChangeDetection } from '@angular/core';

describe('ChatbotComponent', () => {
  let component: ChatbotComponent;
  let fixture: ComponentFixture<ChatbotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatbotComponent ],
      imports: [
        ReactiveFormsModule,
        TranslateModule.forRoot(),
        SelectModule,
        NoopAnimationsModule
      ],
      providers: [
        provideZonelessChangeDetection()
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatbotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle chat visibility', () => {
    expect(component.chatVisible).toBeFalse();
    component.toggleChat();
    expect(component.chatVisible).toBeTrue();
    component.toggleChat();
    expect(component.chatVisible).toBeFalse();
  });

  it('form should be invalid when empty', () => {
    expect(component.chatForm.valid).toBeFalse();
  });

  it('form should be valid when filled correctly', () => {
    component.chatForm.controls['nombre'].setValue('Jules');
    component.chatForm.controls['email'].setValue('jules@example.com');
    component.chatForm.controls['area'].setValue('soporte');
    component.chatForm.controls['mensaje'].setValue('Hola');
    expect(component.chatForm.valid).toBeTrue();
  });
});
