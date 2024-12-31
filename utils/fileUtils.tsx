import CodeIcon from '@mui/icons-material/Code'
import DescriptionIcon from '@mui/icons-material/Description'
import FolderIcon from '@mui/icons-material/Folder'
import FolderZipIcon from '@mui/icons-material/FolderZip'
import ImageIcon from '@mui/icons-material/Image'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'
import MovieIcon from '@mui/icons-material/Movie'
import MusicNoteIcon from '@mui/icons-material/MusicNote'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import PieChartIcon from '@mui/icons-material/PieChart'
import TableViewIcon from '@mui/icons-material/TableView'
import TuneIcon from '@mui/icons-material/Tune'

export type FileType =
  | 'file'
  | 'pdf'
  | 'image'
  | 'video'
  | 'code'
  | 'text'
  | 'audio'
  | 'spreadsheet'
  | 'archive'
  | 'presentation'
  | 'tab'

export const resolveFileType = (filename: string): FileType => {
  const extension = filename.split('.').pop()?.toLowerCase()

  if (!extension) return 'file'

  switch (extension) {
    // PDF
    case 'pdf':
      return 'pdf'

    // Image formats
    case 'jpg': // JPEG image format (widely used)
    case 'jpeg': // JPEG image format (alternative extension)
    case 'png': // Portable Network Graphics format (lossless)
    case 'gif': // Graphics Interchange Format (supports animation)
    case 'bmp': // Bitmap image format
    case 'svg': // Scalable Vector Graphics format
    case 'webp': // Modern image format (supports both lossy and lossless compression)
    case 'tiff': // Tagged Image File Format (high quality, often used in professional photography)
    case 'tif': // Alternate TIFF extension
    case 'ico': // Icon format (used for favicons and application icons)
    case 'heif': // High Efficiency Image Format (used by newer Apple devices)
    case 'heic': // High Efficiency Image Coding (used by Apple for photos)
    case 'eps': // Encapsulated PostScript (vector image format)
    case 'raw': // Raw image format (generic term for unprocessed camera data)
    case 'cr2': // Canon Raw image format
    case 'nef': // Nikon Raw image format
    case 'orf': // Olympus Raw image format
    case 'sr2': // Sony Raw image format
      return 'image'

    // Video formats
    case 'mp4': // Common video format for streaming
    case 'mov': // Apple QuickTime movie format
    case 'avi': // Audio Video Interleave format (Microsoft)
    case 'mkv': // Matroska video format
    case 'webm': // Open-source video format for the web
    case 'flv': // Flash video format
    case 'wmv': // Windows Media Video format
    case 'mpeg': // Moving Picture Experts Group video format
    case 'mpg': // MPEG video format (legacy)
    case '3gp': // Multimedia format for mobile devices
    case 'm4v': // Apple video format (similar to MP4)
    case 'ogv': // Open Video format (WebM alternative)
    case 'rm': // RealMedia video format
    case 'vob': // Video Object file (DVD video format)
    case 'asf': // Advanced Systems Format (Microsoft)
    case 'f4v': // Flash video format (for Adobe Flash)
    case 'ts': // Transport Stream video format
    case 'mxf': // Material Exchange Format (used in broadcast)
      return 'video'

    // Code files
    case 'js': // JavaScript
    case 'ts': // TypeScript
    case 'jsx': // JSX (React)
    case 'tsx': // TSX (TypeScript + JSX)
    case 'html': // HTML
    case 'css': // CSS
    case 'scss': // SCSS (Sass)
    case 'json': // JSON
    case 'yml': // YAML
    case 'yaml': // YAML (alternative extension)
    case 'xml': // XML
    case 'php': // PHP
    case 'java': // Java
    case 'cpp': // C++
    case 'c': // C
    case 'cs': // C#
    case 'py': // Python
    case 'rb': // Ruby
    case 'go': // Go
    case 'swift': // Swift
    case 'rs': // Rust
    case 'dart': // Dart
    case 'kt': // Kotlin
    case 'pl': // Perl
    case 'lua': // Lua
    case 'r': // R
    case 'scala': // Scala
    case 'groovy': // Groovy
    case 'bash': // Bash/Shell script
    case 'sh': // Shell script (alternative extension)
    case 'zsh': // Zsh (alternative shell script)
    case 'sql': // SQL
    case 'asm': // Assembly
    case 'm': // MATLAB
    case 'tsql': // Transact-SQL (T-SQL)
    case 'vhdl': // VHDL
    case 'verilog': // Verilog
    case 'coffee': // CoffeeScript
    case 'elm': // Elm
    case 'h': // C Header
    case 'hpp': // C++ Header
    case 'tex': // LaTeX
    case 'clj': // Clojure
    case 'hs': // Haskell
    case 'ex': // Elixir
    case 'nim': // Nim
    case 'reason': // Reason
    case 'ml': // OCaml
    case 'jl': // Julia
    case 'erl': // Erlang
    case 'lisp': // Lisp
    case 'scheme': // Scheme
      return 'code'

    // Text files
    case 'txt':
    case 'md': // Markdown
    case 'rtf': // Rich Text Format
    case 'log': // Log files
    case 'csv': // Comma-Separated Values
    case 'ini': // Configuration files
    case 'cfg': // Configuration files
    case 'doc': // Microsoft Word
    case 'docx': // Microsoft Word (XML-based)
    case 'odt': // OpenDocument Text
    case 'wps': // Microsoft Works Word Processor
    case 'pages': // Apple Pages
    case 'tex': // TeX documents
    case 'latex': // LaTeX documents
    case 'wpd': // WordPerfect
    case 'asc': // ASCII text
    case 'nfo': // Info files
    case 'me': // ReadMe files
    case 'srt': // Subtitle files
    case 'vtt': // WebVTT subtitle files
      return 'text'

    // Audio formats
    case 'mp3': // MPEG Audio Layer 3
    case 'wav': // Uncompressed audio format
    case 'ogg': // Open-source compressed audio format
    case 'flac': // Lossless audio compression
    case 'aac': // Audio compression format
    case 'm4a': // Apple audio format
    case 'wma': // Windows Media Audio
    case 'alac': // Apple Lossless Audio Codec
    case 'aiff': // Apple audio format
    case 'aif': // AIFF alternate extension
    case 'opus': // Efficient codec for speech and music
    case 'amr': // Speech audio format for mobile devices
    case 'mid': // Musical performance data (MIDI)
    case 'midi': // Alternate MIDI extension
    case 'caf': // Core Audio Format (Apple)
    case 'dsd': // High-resolution audio format
    case 'pcm': // Uncompressed audio format
    case 'ra': // RealAudio streaming format
    case 'rm': // RealMedia (audio-based)
    case 'voc': // Creative Voice file format
      return 'audio'

    // Spreadsheet formats
    case 'xls': // Microsoft Excel
    case 'xlsx': // Microsoft Excel (XML-based)
    case 'xlsm': // Excel with Macros
    case 'xlsb': // Excel Binary Workbook
    case 'xltx': // Excel Template
    case 'xltm': // Excel Template with Macros
    case 'ods': // OpenDocument Spreadsheet
    case 'csv': // Comma-Separated Values
    case 'tsv': // Tab-Separated Values
    case 'fods': // Flat OpenDocument Spreadsheet
    case 'numbers': // Apple Numbers
    case 'wbk': // Workbook Backup
    case 'dif': // Data Interchange Format
    case 'sylk': // Symbolic Link Format
    case 'prn': // Space- or tab-separated values
      return 'spreadsheet'

    // Archive formats
    case 'zip': // ZIP Archive
    case 'tar': // Tape Archive
    case 'gz': // Gzip Compressed Archive
    case 'rar': // RAR Archive
    case '7z': // 7-Zip Archive
    case 'bz2': // Bzip2 Compressed Archive
    case 'xz': // XZ Compressed Archive
    case 'tgz': // Tarball compressed with Gzip
    case 'tbz': // Tarball compressed with Bzip2
    case 'txz': // Tarball compressed with XZ
    case 'iso': // Disk Image
    case 'cab': // Cabinet Archive
    case 'arj': // ARJ Archive
    case 'lzh': // LHA Archive
    case 'z': // UNIX compress archive
    case 'lz': // Lzip Archive
    case 'rpm': // Red Hat Package Manager Archive
    case 'deb': // Debian Package Archive
    case 'pkg': // macOS Installer Package
    case 'dmg': // macOS Disk Image
    case 'cpio': // CPIO Archive
    case 'ace': // ACE Archive
    case 'alz': // ALZip Archive
    case 'wim': // Windows Imaging Format
    case 'jar': // Java Archive
    case 'war': // Web Application Archive
    case 'apk': // Android Package
      return 'archive'

    // Presentation formats
    case 'ppt': // Microsoft PowerPoint
    case 'pptx': // Microsoft PowerPoint (XML-based)
    case 'pps': // PowerPoint Slide Show
    case 'ppsx': // PowerPoint Slide Show (XML-based)
    case 'pot': // PowerPoint Template
    case 'potx': // PowerPoint Template (XML-based)
    case 'odp': // OpenDocument Presentation
    case 'key': // Apple Keynote
    case 'dps': // Kingsoft Presentation
    case 'gslides': // Google Slides (shortcut)
    case 'sspss': // SoftMaker Presentations Slide Show
    case 'sxi': // StarOffice Impress Presentation
      return 'presentation'

    // GuitarPro tabulature
    case 'gp3': // GuitarPro 3 file format
    case 'gp4': // GuitarPro 4 file format
    case 'gp5': // GuitarPro 5 file format
    case 'gpx': // GuitarPro 6 and later XML file format
    case 'gp': // GuitarPro generic file format (used for earlier versions)
      return 'tab'

    // Default
    default:
      return 'file'
  }
}

export const getIcon = (type: FileType) => {
  switch (type) {
    case 'pdf':
      return <PictureAsPdfIcon sx={{ fontSize: 50, color: 'error.main' }} />
    case 'image':
      return <ImageIcon sx={{ fontSize: 50, color: 'success.main' }} />
    case 'video':
      return <MovieIcon sx={{ fontSize: 50, color: 'secondary.main' }} />
    case 'code':
      return <CodeIcon sx={{ fontSize: 50, color: 'info.main' }} />
    case 'text':
      return <DescriptionIcon sx={{ fontSize: 50, color: 'text.secondary' }} />
    case 'audio':
      return <MusicNoteIcon sx={{ fontSize: 50, color: 'warning.main' }} />
    case 'spreadsheet':
      return <TableViewIcon sx={{ fontSize: 50, color: 'success.dark' }} />
    case 'archive':
      return <FolderZipIcon sx={{ fontSize: 50, color: 'text.primary' }} />
    case 'presentation':
      return <PieChartIcon sx={{ fontSize: 50, color: 'secondary.dark' }} />
    case 'tab':
      return <TuneIcon sx={{ fontSize: 50, color: 'info.main' }} />
    default:
      return (
        <InsertDriveFileIcon sx={{ fontSize: 50, color: 'text.secondary' }} />
      )
  }
}
