import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient }                   from '@angular/common/http';
import { CommonModule }                 from '@angular/common';
import { FormsModule }                  from '@angular/forms';
import { Subject }                      from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  takeUntil,
  finalize
} from 'rxjs/operators';

/* ── Interfaces ─────────────────────────────────────────────── */
export interface Story {
  id:     number;
  title:  string;
  url:    string | null;
  score?: number;
  by?:    string;
  time?:  number;
}

export interface ApiResponse {
  data:  Story[];
  total: number;
}

/* ── Component ──────────────────────────────────────────────── */
@Component({
  selector:    'app-root',
  standalone:  true,
  imports:     [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls:   ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  /* ── State ─────────────────────────────────────────────── */
  stories:  Story[]       = [];
  total     = 0;
  page      = 1;
  pageSize  = 10;
  search    = '';
  loading   = false;
  error:    string | null = null;

  /* ── RxJS ──────────────────────────────────────────────── */
  private searchSubject = new Subject<string>();
  private destroy$      = new Subject<void>();

  /* Skeleton placeholder array (10 empty slots) */
  readonly skeletonItems = Array(10).fill(null);

  /* ── API endpoint — change to your backend URL ─────────── */
  private readonly API = 'http://localhost:5000/api/stories';

  constructor(private http: HttpClient) {}

  /* ── Lifecycle ─────────────────────────────────────────── */
  ngOnInit(): void {
    // Initial load
    this.loadStories();

    // Debounced search
    this.searchSubject.pipe(
      debounceTime(350),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.page = 1;
      this.loadStories();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /* ── Data Fetching ─────────────────────────────────────── */
  loadStories(): void {
    this.loading = true;
    this.error   = null;

    const params = `page=${this.page}&search=${encodeURIComponent(this.search)}`;

    this.http
      .get<ApiResponse>(`${this.API}?${params}`)
      .pipe(
        finalize(() => (this.loading = false)),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (res) => {
          this.stories = res.data  ?? [];
          this.total   = res.total ?? 0;
        },
        error: (err) => {
          this.error   = err?.error?.message ?? err?.message ?? 'Failed to fetch stories.';
          this.stories = [];
        }
      });
  }

  /** Fired on every keypress in the search input */
  onSearchInput(): void {
    this.searchSubject.next(this.search);
  }

  /** Clear button handler */
  clearSearch(): void {
    this.search = '';
    this.page   = 1;
    this.loadStories();
  }

  /* ── Pagination ────────────────────────────────────────── */
  get totalPages(): number  { return Math.ceil(this.total / this.pageSize) || 1; }
  get pageStart():  number  { return (this.page - 1) * this.pageSize + 1; }
  get pageEnd():    number  { return Math.min(this.page * this.pageSize, this.total); }
  get isFirstPage(): boolean { return this.page <= 1; }
  get isLastPage():  boolean { return this.page >= this.totalPages; }

  prevPage(): void {
    if (!this.isFirstPage) { this.page--; this.loadStories(); }
  }

  nextPage(): void {
    if (!this.isLastPage) { this.page++; this.loadStories(); }
  }

  goToPage(p: number): void {
    if (p >= 1 && p <= this.totalPages && p !== this.page) {
      this.page = p;
      this.loadStories();
    }
  }

  /* ── Utilities ─────────────────────────────────────────── */

  /** Extracts clean hostname from URL for the read button label */
  getHostname(url: string | null): string {
    if (!url) return '';
    try   { return new URL(url).hostname.replace(/^www\./, ''); }
    catch { return ''; }
  }

  /** Returns page numbers around current page (window of ±2) */
  getPageNumbers(): number[] {
    const delta = 2;
    const from  = Math.max(1, this.page - delta);
    const to    = Math.min(this.totalPages, this.page + delta);
    const pages: number[] = [];
    for (let i = from; i <= to; i++) pages.push(i);
    return pages;
  }

  /** trackBy function for *ngFor performance */
  trackByStory(_index: number, story: Story): number {
    return story.id;
  }
}