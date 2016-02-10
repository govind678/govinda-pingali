<!DOCTYPE html>
    
<html>
    <head>
        <title>Govinda Ram Pingali</title>
        <meta name="keywords" content="Govinda, Ram, Pingali, Music, Technology"/>
        <meta name="description" content="Govinda Ram Pingali's music page"/>
        <meta name="author" content="Govinda Ram Pingali"/>
        <meta charset="utf-8"/>
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <meta http-equiv="Cache-Control" content="no cache"/>
        
        <!-- Styles -->
        <link rel="stylesheet" type="text/css" href="../stylesheets/index.css"/>
        <link rel="stylesheet" type="text/css" href="../stylesheets/projects.css"/>
        
        
        <!--[if IE]>
        <script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
        <![endif]-->
    
    
        <!-- Scripts -->
        <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4/jquery.min.js"></script>
        <script type='text/javascript' src='js/jquery.ba-hashchange.min.js'></script>
        <script type='text/javascript' src='../js/dynamicpage.js'></script>
        
        
    </head>
    
    <body onload=set_visible('link1');>
        
        <script type="text/javascript">
            function set_visible(id)
            {
                for (var i=1; i<=5; i++)
                {
                    var e = document.getElementById('link' + i);
                    e.style.display = 'none';
                }
                
                var f = document.getElementById(id);
                f.style.display = 'block';
            }
        </script>
        
        
        
        <div id="navigation">
            
            <div id="title"><a href="../index.php">
                <div id="heading">Govinda Ram Pingali</div>
                <div id="sub-heading">music + technology</div>
            </a></div>
            
            
            <div id="links">
                <table class="links_table" cellspacing="0">
                    <tr>
                    <td id="bio"><span><a href= "bio.php">bio</a></span></td>
                    <td id="projects"><span><a href= "projects.php">projects</a></span></td>
                    <td id="music"><span><a href= "music.php">music</a></span></td>
                    <td id="contact"><span><a href= "contact.php">contact</a></span></td>
                    </tr>
                </table>
            </div>
            
        </div>
        
        <div id="content-container">
            
            <div id="projects-nav">
                <div class="project-grouping" id="gtcmt-div">Georgia Tech Center for Music Technology</div>
                <div class="project-listing" id="gtcmt">
                    <ul>
                        <li><a href="#" onclick=set_visible('link1');>Motion Music</a></li>
                        <li><a href="#" onclick=set_visible('link2');>Beat Surface</a></li>
                        <li><a href="#" onclick=set_visible('link3');>Synesthesizer</a></li>
                        <!-- <li><a href="#" onclick=set_visible('link4');>Soundshop</a></li> -->
                    </ul>
                </div>
                <div class="project-grouping" id="rvce-div">RV College of Engineering</div>
                <div class="project-listing" id="rvce">
                    <ul>
                        <li><a href="#" onclick=set_visible('link5');>Project Wheelie</a></li>
                    </ul>
                </div>
            </div>
            
            <div id="projects-content">
                
                <div id="link1" class="project-info">
                    <span class="project-title">Motion Music</span>
                    <p class="project-text">Currently building a guitar pedal-board style audio effects iOS application whose effect paramters are controlled by motion gestures. UI using native iOS buttons and sliders. Audio processing in C++ using JUCE library.</p>
                    <div style="position: relative; margin: 0 auto; left: 120px; top: 18px;"><iframe width="560" height="315" src="//www.youtube.com/embed/sBLQOIzatBg?rel=0" frameborder="0" allowfullscreen></iframe></div>
                    <div style="position: relative; margin-top: 60px;"><a href="https://github.com/govind678/GestureController" target="_blank" style="color: #111111; ">Link to source code</a></div>
                </div>
                
                
                <div id="link2" class="project-info">
                    <span class="project-title">Beat Surface</span>
                    <p class="project-text">Currently implementing a real-time percussive onset detection and classification system as part of research under Dr. Alexander Lerch. LibSVM used for classification. Implementation in C++ using JUCE library.</p>
                    <div style="position: relative; float: left; top: 30px;"><img src="../images/beatsurface1.jpg" width="400px" height="222px" style="margin: auto"></div>
                    <div style="position: relative; float: right; top: 30px;"><img src="../images/beatsurface2.jpg" width="400px" height="222px" style="margin: auto"></div>
                    <div style="position: relative; top: 153px;"><a href="https://github.com/govind678/BeatSurface" target="_blank" style="color: #111111; ">Link to source code</a></div>
                </div>
                
                
                <div id="link3" class="project-info">
                    <span class="project-title">Synesthesizer</span>
                    <p class="project-text">A drawing musical interface where music is automatically generated based on sketches / doodles drawn on a canvas. The system uses concepts from Russell's circumplex model of emotion.
                    A 'valence' and 'arousal' value from the drawings is extracted using standard computer vision techniques such as blob tracking and color thresholding. 2nd order Markov chains trained on Indian classical music is used to generate music.
                    The project was implemented in Max/MSP using the cv.jit (openCV for Max/MSP) library.
                    </p>
                    <div style="position: relative; float: left; top: 30px;"><img src="../images/synesthesizer1.jpg" width="380px" height="240px" style="margin: auto"></div>
                    <div style="position: relative; float: right; top: 30px;"><img src="../images/synesthesizer2.jpg" width="400px" height="240px" style="margin: auto"></div>
                    <div style="position: relative; top: 60px;"><a href="https://github.com/govind678/Synesthesizer-II" target="_blank" style="color: #111111; ">Link to source code</a></div>
                    
                </div>
                
                
                <div id="link4" class="project-info">
                    <span class="project-title">Soundshop</span>
                    <p class="project-text">iOS application that applies convolution reverb and antiquing effects to recorded audio samples. Implementation in native Objective C.</p>
                    <div style="position: relative; float: left; top: 20px;"><img src="../media/soundshop1.jpg" width="250px" height="140px" style="margin: auto"></div>
                    <div style="position: relative; float: left; top: 20px; left: 30px"><img src="../media/soundshop2.jpg" width="250px" height="140px" style="margin: auto"></div>
                    <div style="position: relative; float: right; top: 20px;"><img src="../media/soundshop3.jpg" width="250px" height="140px" style="margin: auto"></div>
                </div>
                
                
                <div id="link5" class="project-info">
                    <span class="project-title">Project Wheelie</span>
                    <p class="project-text">
                    Designed and built an eye gesture controlled semi-automatic electric wheelchair using electro-oculography (EOG) to aid victims of quadriplegia, during my undergraduate studies at RV College of Engineering.
                    My contributions include designing filter circuits for EOG, mapping eye gestures to the drive control of the wheelchair and implementing wireless controls using XBEE.
                    </p>
                    <div style="position: relative; float: left; top: 30px;"><img src="../images/wheelie1.jpg" width="380px" height="260px" style="margin: auto"></div>
                    <div style="position: relative; float: right; top: 30px;"><img src="../images/wheelie2.jpg" width="380px" height="260px" style="margin: auto"></div>
                    
                    
                </div>
                
            </div>
            
        </div>
        
        <div id="footer">
            &#169 2013 &nbsp &nbsp &nbsp
            Govinda Ram Pingali &nbsp &nbsp &nbsp
            Master of Science in Music Technology &nbsp &nbsp &nbsp
            Georgia Institute of Technology
        </div>
    </body>
</html>